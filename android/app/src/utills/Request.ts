/**  데이터 백엔드에 get 요청을 보냅니다.
 * @param url 요청주소
 * @returns 응답 json
 * @example
 * // async, await 방식
 * async function any() {
 *   const data = await reqGet('url');
 *   console.log(data.아무개);
 * }
 * // callback 방식
 * reqGet('url')
 *  .then(data => console.log(data.아무개))
 *  .catch(err => console.log(err));
 */
export async function reqGet(url: string): Promise<any> {
  const res = await fetch(url, {
    headers: {
      Accept: 'application/json',
    },
  });

  return await res.json();
}

/** 데이터 백엔드에 post 요청을 보냅니다.
 * @param url 요청주소
 * @param body 요청 js객체
 * @returns 응답 json
 * @example
 * // async, await 방식
 * async function any() {
 *   const data = await reqGet('url', {키: '값'});
 *   console.log(data.아무개);
 * }
 * // callback 방식
 * reqGet('url', {키: '값'})
 *  .then(data => console.log(data.아무개))
 *  .catch(err => console.log(err));
 */
export async function reqPost(url: string, body: object): Promise<any> {
  const res = await fetch(url, {
    method: 'post',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  return await res.json();
}

/** AR백엔드에 요청을 보냅니다
 * @param url 요청주소
 * @param formData  FormData (하단 예제 참고 바람)
 * @returns 요청 결과 값 (API 결과에 따라 json 이나 blob로 적절히 변환하여 사용바랍니다)
 * @example
 * // FormData 예제
 * const formData = new FormData();
 * // 파일 요청
 * formData.append('form-data 키값', {
 *  name: "파일이름.jpg",
 *  uri: "파일 uri",
 *  type: "image/jpeg",
 * };
 * // 일반 데이터
 * formData.append('form-data 키값', '값');
 */
export async function ArRequest(
  url: string,
  formData: FormData,
): Promise<Response> {
  // url 에 /있는지 판단
  if (url.slice(-1) !== '/') {
    url = url + '/';
  }

  return await fetch(url, {
    method: 'post',
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    body: formData,
  });
}

/** 파일 업로드 API 를 호출합니다
 * @param url 요청주소
 * @param formData  FormData (하단 예제 참고 바람)
 * @returns 응답 json
 * @example
 * // FormData 예제
 * const formData = new FormData();
 * // 파일 요청
 * formData.append('form-data 키값', {
 *  name: "파일이름.jpg",
 *  uri: "파일 uri",
 *  type: "image/jpeg",
 * };
 * // 일반 데이터
 * formData.append('form-data 키값', '값');
 *
 * // async, await 방식
 * async function any() {
 *   const data = await reqFileUpload('url', formData);
 *   console.log(data.data.아무개);
 * }
 * // callback 방식
 * reqFileUpload('url', formData)
 *  .then(data => console.log(data.data.아무개))
 *  .catch(err => console.log(err));
 */
export async function reqFileUpload(
  url: string,
  formData: FormData,
): Promise<{
  ok: boolean;
  data: any;
}> {
  const res = await fetch(url, {
    method: 'post',
    headers: {
      'Content-Type': 'multipart/form-data',
      Accept: 'application/json',
    },
    body: formData,
  });

  return {
    ok: res.ok,
    data: await res.json(),
  };
}
