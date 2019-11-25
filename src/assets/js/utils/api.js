/*
 * @Author: yaodongyi
 * @Date: 2019-08-28 10:52:48
 * @Description: api接口
 */
import axios from '../common/axios-pack';
/**
 * 测试接口
 * @param {Object} params
 * @api {post} https://www.easy-mock.com/mock/5ccec7de7ffbe958f9bc418b/all
 */
export const all_api = params => {
  return axios.get(`all`, params);
};

export const all_mock = params => {
  return axios.get(`mock`, params);
};