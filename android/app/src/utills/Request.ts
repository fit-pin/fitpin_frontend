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
    body: formData,
  });
}
