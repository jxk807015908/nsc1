import axios from 'axios'
import {Message} from 'element-ui'
import {MessageBox} from 'element-ui'

axios.interceptors.response.use((res) =>{
  if(!res.data.success){
    Message.error(res.data.msg)
  }
  return res;
});
export default axios;
