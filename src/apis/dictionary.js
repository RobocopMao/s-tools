import Request from './request';

const request = new Request();

/**
 * 查询单个汉字的读音和含义
 * @param data： {content: 需要查询的汉字}
 * @returns {Promise<void>}
 */
export const getDictionaryContent = async (data) => {
  return await request.get({
    url: '/convert/dictionary',
    data,
  });
};
