export class UrlUtil {
  public static getSearchParam(url: string, key: string): string {
    const searchParamsUrl = new URL(url);
    const param: string = searchParamsUrl.searchParams.get(key) ?? '';

    return param;
  }
}