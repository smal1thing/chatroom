
import axios from "axios";
import { SendOutlined, MoneyCollectOutlined, GiftOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { useState, useEffect, useRef } from 'react';
import { Input, Button, message, Modal } from 'antd';
import { ShareModal } from './components/ShareModal'
import { PayModal } from "./components/PayModal";
import { ActivityModal } from "./components/ActivityModal";
import { MessageBox } from "./components/MessageBox";
import 'antd/dist/antd.css';
import './App.css';
import { BaseButton } from "./components/BaseButton";
// import md5 from './md5';



const baseUrl = "https://platypus.yazuishoudalu.com/"
export const API = axios.create({
  baseURL: baseUrl,
});

const mockMessage = [{
  sender: 0,
  message: `您好！我是钛月AI助手，是一款基于ChatGPT使用的gpt3.5引擎开发的智能聊天机器人。

  我可以：论文润色、知识百科、百度答题、作业解答分析、写代码，角色扮演等等...  
  
  您可以尝试输入以下问题，看看我的能力: 
  [解释下量子计算机的原理] 
  [我要举办生日会，策划一个有趣的活动] 
  [写一篇广告策划方案]`
}];

function useStateAndRef(initial) {
  const [value, setValue] = useState(initial);
  const valueRef = useRef(value);
  valueRef.current = value;
  return [value, setValue, valueRef];
}

function App() {
  const [messageList, setMessageList] = useState(mockMessage);
  const [inputText, setInputText] = useState('');
  const [userId, setUserId] = useState('');
  const [userInvitationCode, setUserInvitationCode] = useState('');
  const [balance, setBalance] = useState();
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState('');
  const [payModalOpen, setPayModalOpen] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [chargeEnable, setChargeEnable] = useState(false);

  const [shareInvitationUrl, setShareInvitationUrl] = useState("");

  const [debugString, setDebugString] = useState('');

  const scrollToBottom = () => {
    const v = document.getElementsByClassName('message-part')[0];
    if (v) {
      v.scrollTop = 10000000;
    }
  }

  useEffect(() => {
    const params = window.location.search?.split('?')[1]?.split('&');
    const foundCode = params?.find(param => param.includes('code='));
    const foundState = params?.find(param => param.includes('state='))
    if (foundCode) {
      const code = foundCode.split('code=')[1];
      let invtCode = '';
      if (foundState) {
        invtCode = foundState.split('state=')[1];
      }
      getUserId(code, invtCode);
    } else {
      message.warn('缺少用户code')
    }
  }, [])

  const getUserId = async (code, invtCode) => {
    console.log(code, invtCode);
    await axios.get(`${baseUrl}chat_proxy/get_user_wx_id?js_code=${code}&ic=${invtCode}`).then((response) => {
      const data = response?.data?.data
      console.log(data)
      if (data?.wx_id) {
        setUserId(data.wx_id);
      } else {
        message.warn(data);
      }
      if (data?.quota) {
        setBalance(data.quota);
      }
      if (data?.invitation_code) {
        setUserInvitationCode(data.invitation_code);
      }
      if (data?.share_invitation_url) {
        setShareInvitationUrl(data.share_invitation_url);
      } else {
        message.warn(data);
      }
    }).catch(r => console.log(r))
  }

  const handleLoading = () => {
    if (loadingText.length === 3) {
      setLoadingText('');
    } else {
      setLoadingText(loadingText + '•');
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
      console.log(responseMessage);
      const quota = response.data?.data?.quota;
      if (responseMessage && quota) {
        newMessageList.splice(-1, 1, {
          sender: 0,
          message: responseMessage
        });
        setMessageList(newMessageList);
        setBalance(quota);
      } else if (response.data.data === 'no chat quota') {
        newMessageList.splice(-1, 1, {
          sender: 0,
          message: `如需更多消息次数：  

          • 点击”分享”按钮，复制你的专属邀请链接，邀请一位新用户点击使用，即可获取5条消息奖励
          
          • 购买3元试用套餐或18元包月高级无限制会员`
        });
        setChargeEnable(true);
        setMessageList(newMessageList);
      } else if (response.data.data === 'sensitive words') {
        newMessageList.splice(-1, 1, {
          sender: 0,
          message: `很抱歉，您发送的内容检测出敏感词，请换一种说法。如果仍有问题，请联系公众号【钛月AI问答助手】`
        });
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
      {debugString !== "" && <div className='user-id' onClick={() => { }}>{debugString}</div>}
      <div className='message-part'>
        {
          messageList.map(item =>
            <MessageBox sender={item.sender} message={item.message} loadingText={loadingText}></MessageBox>
          )
        }
      </div>
      <div className='typing-part'>
        <div className="">
          {chargeEnable ? <BaseButton
            buttonText="充值"
            onClick={() => {
              setPayModalOpen(true);
            }}
            icon={<MoneyCollectOutlined style={{ color: 'gold' }} />}
          /> : ''}
          <BaseButton
            buttonText="分享"
            onClick={() => {
              setShareModalOpen(true);
            }}
            icon={<GiftOutlined style={{ color: 'red' }} />}
          />
          {userInvitationCode !== '' &&
            <div className='balance'>
              <InfoCircleOutlined style={{ color: 'blue', paddingRight: '5px' }} />
              邀请码: {userInvitationCode}
            </div>
          }
        </div>
        <div className='typing-line'>
          <Input
            placeholder='请输入'
            value={inputText}
            size="large"
            onChange={(v) => setInputText(v.target.value)}
            onPressEnter={() => sendMessage(inputText)}
            suffix={(<Button icon={(<SendOutlined style={{ color: '#74c6b0', fontSize: '20px' }} />)} onClick={() => sendMessage(inputText)} type="text" />)}
          />
          {/* <Button className='sent-button' type='primary' onClick={() => sendMessage(inputText)}>发送</Button> */}
        </div>
      </div>

      <PayModal payModalOpen={payModalOpen} userId={userId} setPayModalOpen={(open) => setPayModalOpen(open)}></PayModal>

      <ShareModal open={shareModalOpen}
        onCancel={() => { setShareModalOpen(false) }}
        shareInvitationUrl={shareInvitationUrl}>
      </ShareModal>

      <ActivityModal>
      </ActivityModal>
    </div >
  );
}

export default App;
