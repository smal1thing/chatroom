
import axios from "axios";
import { useState, useEffect } from 'react';
import { Input, Button, message } from 'antd';
import 'antd/dist/antd.css';
import './App.css';

const ROBOT_AVATAR = "https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fimg2.doubanio.com%2Fview%2Frichtext%2Flarge%2Fpublic%2Fp53389253.jpg&refer=http%3A%2F%2Fimg2.doubanio.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1679757641&t=a44588a81d7efe7dc16416d4b89059eb";
const USER_AVATAR = "https://ts1.cn.mm.bing.net/th/id/R-C.0a1f275d1d27d96f996ae5af9cc838eb?rik=ifvouAHyyFj8cg&riu=http%3a%2f%2fwww.yulumi.cn%2fgl%2fuploads%2fallimg%2f201204%2f3-20120415332MI.jpg&ehk=FWvR8lLqblGnk%2bLTcv7CSk8AlAh1U5CdHJDAoHY45rc%3d&risl=&pid=ImgRaw&r=0";
const baseUrl = "https://platypus.yazuishoudalu.com/"
export const API = axios.create({
  baseURL: baseUrl,
});

const mockMessage = [{
  sender: 0,
  message: '你好，我是钛月ai助手，欢迎使用聊天室，来问我一个问题吧'
}
]

function App() {
  const [messageList, setMessageList] = useState(mockMessage);
  const [inputText, setInputText] = useState('');
  const [userId, setUserId] = useState('');
  const [balance, setBalance] = useState();
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState('');

  const scrollToBottom = () => {
    const v = document.getElementsByClassName('message-part')[0];
    if (v) {
      v.scrollTop = 10000000;
    }
  }

  useEffect(() => {
    const params = window.location.search?.split('?')[1]?.split('&');
    const found = params?.find(param => param.includes('code='));
    if (found) {
      const code = found.split('code=')[1];
      getUserId(code)
    } else {
      message.warn('缺少用户code')
    }
  }, [])

  const getUserId = async (code) => {
    await axios.get(baseUrl + 'chat_proxy/get_user_wx_id?js_code=' + code).then((response) => {
      const data = response?.data?.data
      if (data?.wx_id) {
        setUserId(data.wx_id);
      } else {
        message.warn(data)
      }
      if (data?.quota) {
        setBalance(data.quota);
      }
    }).catch(r => console.log(r))
  }

  const handleLoading = () => {
    if (loadingText.length === 3) {
      setLoadingText('');
    } else {
      setLoadingText(loadingText+'•');
    }
  }

  useEffect(() => {
    scrollToBottom();
  }, [messageList]);

  useEffect(() => {
    if (loading) {
      setTimeout(handleLoading, 300)
    }
  }, [loadingText, loading])



  const pay = async (amount) => {
    const params = {
      "user_id": userId,
      "amount": 0.1
    }
    await axios.post(baseUrl + 'chat_proxy/wechat_jsapi_pay', params).then((response) => {
      const responseData = response?.data?.data;
      if (responseData) {
        const { transaction_id, prepay_id } = responseData;
        // console.log(transaction_id, prepay_id);
        const checkPaymentParams = {
          transaction_id
        }
        // onBridgeReady();
        return axios.post(baseUrl + 'chat_proxy/wechat_jsapi_query', checkPaymentParams);
      }
    }).then((r) => {
      message.info(`充值${r?.data.data?'成功':'失败'}`)
    }).catch(r => console.log(r))
  }

  const sendMessage = async (sendText) => {
    if (!userId) {
      message.warn('缺少用户信息，请重试');
      return;
    }
    const params = {
      'prompt': sendText,
      "user_id": userId
    }
    const newMessageList = [...messageList];
    newMessageList.push({
      sender: 1,
      message: sendText
    }, {
      sender: 2
    });
    setLoading(true);
    setInputText('');
    setMessageList(newMessageList);
    await axios.post(baseUrl + 'chat_proxy/get_chat_text', params).then((response) => {
      const responseMessage = response.data?.data?.result;
      const quota = response.data?.data?.quota;
      if (responseMessage && quota) {
        newMessageList.splice(-1, 1, {
          sender: 0,
          message: responseMessage
        });
        setMessageList(newMessageList);
        setBalance(quota);
      } else {
        message.info(response.data?.data);
        newMessageList.splice(-1, 1, {
          sender: 0,
          message: response.data?.data
        });
        setMessageList(newMessageList);
      }
      setTimeout(scrollToBottom, 0);
    }).catch(r => {
      console.log(r);
      newMessageList.splice(-1, 1);
      setMessageList(newMessageList);
    })
    setLoading(false);
  }

  return (
    <div className="chat-room">
      {userId !== "" && <div className='user-id'>userid: {userId}</div>}
      <div className='message-part'>
        {
          messageList.map(item =>
            <MessageBox sender={item.sender} message={item.message} loadingText={loadingText}></MessageBox>
          )
        }
      </div>
      <div className='typing-part'>
        {/* <div className="">
          <Button className='charge-button' onClick={pay}>充值</Button>
          <Button className='charge-button' disabled>历史对话</Button>
          <div className='balance'> 还可以提问{balance}次</div>
        </div> */}
        <div className='typing-line'>
          <Input
            placeholder='请输入'
            value={inputText}
            size="large"
            onChange={(v) => setInputText(v.target.value)}
            onPressEnter={() => sendMessage(inputText)}></Input>
          <Button className='sent-button' type='primary' onClick={() => sendMessage(inputText)}>发送</Button>
        </div>
      </div>
    </div>
  );
}

function MessageBox(props) {
  const { sender, message, loadingText } = props;
  if (sender === 2) {
    return (
      <div className="received-dialog-line">
        <div><img className="avatar" src={ROBOT_AVATAR}></img></div>
        <div className="loading-message">{loadingText}</div>
      </div>
    )
  }
  return sender === 0 ? (
    <div className="received-dialog-line">
      <div><img className="avatar" src={ROBOT_AVATAR}></img></div>
      <div className="message"><span>{message}</span></div>
    </div>
  ) : (
    <div className='sent-dialog-line'>
      <div className="message"><span>{message}</span></div>
      <div><img className="avatar" src={USER_AVATAR}></img></div>
    </div>
  )
}

export default App;
