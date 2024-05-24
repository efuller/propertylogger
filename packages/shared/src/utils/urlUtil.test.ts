import { UrlUtil } from './UrlUtil';

describe('UrlUtil', () => {
  it.each([
    { url: 'https://www.google.com?search=hello', key: 'search', param: 'hello' },
    { url: 'https://www.google.com?search=hello&name=world', key: 'name', param: 'world' },
    { url: 'https://www.google.com?search=hello&name=world', key: 'nonexistent', param: '' },
  ])('should return "$param" for "$key" param in $url', ({url, key, param}) => {
    expect(UrlUtil.getSearchParam(url, key)).toBe(param);
  });
});