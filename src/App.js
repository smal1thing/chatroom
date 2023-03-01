
import axios from "axios";
import { useState, useEffect, useRef } from 'react';
import { Input, Button, message, Modal } from 'antd';
import 'antd/dist/antd.css';
import './App.css';
import JSEncrypt from 'jsencrypt'
import CryptoJS from "crypto-js";
// import md5 from './md5';

const PRIVATE_KEY = `-----BEGIN PRIVATE KEY-----
MIIEvwIBADANBgkqhkiG9w0BAQEFAASCBKkwggSlAgEAAoIBAQDiIV/USRpWzzb+
6f92AiZSApE6Xka1iJztOfwt9mYQ88mweFRQjurRLw+6aP9yFKD1GmZhoEH/ToJ7
n0N3S2Xu6cT70piHQRGAVP50sxTYEfIm7y1Qro3LKMdWlkbgeyCPXojUkT/z9nGU
zJqAraoHX4SQZhqeGuAfHNMj2evIKJ/GoBSTUXZxfI2kuHg9Y6W7kt7VXTa6Xvw3
snZytnsfx6Dpva/ouzBMfHWfoauOLdG53vzFAlLEbjxRuyQAQhMclGHUnGoxqjwP
QOIGrngkgyIkp7MRSLIGp3Vo5jaIcHBTx8hx9n4SWFO/bBvZYo0xK4nWdPC8q4JL
q+8q9YAHAgMBAAECggEBANy6HRNXRBmGbLVI7a5gDM2yadYinjymnB9HoWuv/xL/
FFloK0zzJCyKFn0r7mSJ1E9LtLIIv0MZfG51GGLCuz4I+9mfSHmFvzKYRETfZTI/
2jG892uw5wFuzZ0sVQTbyv2HFmL/YQCfB2FqkkmWusg1qW1V7Rd1Pl3AQizVk7ws
bS7gRmXF2OGBIu/8mLzAfdNnI8j9uTjDcC49M9KdkPkypXN7yiByjU+angYq+giG
/puCkMEH9d44eFN4i0iA8BnKMEwxugnKilL/wynbgw0JHnutwvPF3oeNj+J6LVaw
wU4Gfoijov2ni5MP4fH6tG7dIlhqjdNZsmeMQ6pkYTECgYEA+jN8zuXG6tSXaRR3
ZgjeLk9b6iUADErNggpmZ62KWx/gVI2OActSW6JIB5SHOSXbx5I7qTfQAjjN+BaY
pvJJYOsZdU+Bk6JeaUAcsXGCi9L2HhCmo+t19UNe1FVV105T4YZEMKHRTRvjKd4f
t8LS5j6RzfI0l9Rprn3EfKDMpX8CgYEA518Rf8CETc2vZIgwOoSd4hyJ6J1r2wag
RrPx0AO2DZqu499K7hdGp/ztM/xlikW1a4+aurte4A7Gr41Gxh+dVQ5hDUTtewtR
bPDaMAYi1NRo0kraHXCpbOixOhLW4XNWTM1ALypE+aLxEiGBc3Oe5sIf0WAJLWVb
EVnpsQueOXkCgYEAsZ9n1YIuq3vtWb4b3aYiBYJ1YE6QMCnSp6U2ehgrhvGkUqKD
1CZB+6fDtw3syddkpdPc4w8qbslg/+UazjpneZSt6Chfdy3oFJRdSmOpKBbGfyWX
B/wbK9l+MwO6AzYqOosVUekvK6zGomx82/pFuwtke26dg8RamnPS0B9f6YUCgYBB
PsTfgrmMezE3p1P6XIVtSuD08NeGZ0LxTTMmlrVS9sjUx5YIuBWbr65wV3+G04uK
bm+Sst3ZTzFmNe+8VRP39VsW89YIObPXhb/xhPlzjQaWLrd9T9TnOmMn3kIsR2sR
s1ujMUdMIk/a7gnkNbmclyeD0pIj9A4PQYyt+Xm/+QKBgQCar5TCarOV93AemxPo
1LcxAMBe6AKTkYtvzbAIaCgnNKV3hwq74dlO/m0In0mPumOk0/pjgXyr4jEoFbwg
bDjpcVytgh4M9nE2hImmnEOWF1Mqnug09QRg1qhqLVpTjRB+fLNwxq0S84oz4wnQ
jTFseK2f9Iwvn6t+AlDrB9rNyQ==
-----END PRIVATE KEY-----`
const ROBOT_AVATAR = "https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fimg2.doubanio.com%2Fview%2Frichtext%2Flarge%2Fpublic%2Fp53389253.jpg&refer=http%3A%2F%2Fimg2.doubanio.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1679757641&t=a44588a81d7efe7dc16416d4b89059eb";
const USER_AVATAR = "https://ts1.cn.mm.bing.net/th/id/R-C.0a1f275d1d27d96f996ae5af9cc838eb?rik=ifvouAHyyFj8cg&riu=http%3a%2f%2fwww.yulumi.cn%2fgl%2fuploads%2fallimg%2f201204%2f3-20120415332MI.jpg&ehk=FWvR8lLqblGnk%2bLTcv7CSk8AlAh1U5CdHJDAoHY45rc%3d&risl=&pid=ImgRaw&r=0";
const baseUrl = "https://platypus.yazuishoudalu.com/"
export const API = axios.create({
  baseURL: baseUrl,
});

const mockMessage = [{
  sender: 0,
  message: '你好，我是钛月ai助手，欢迎使用聊天室，来问我一个问题吧'
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
  const [balance, setBalance] = useState();
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [rechargeAmount, setRechargeAmount] = useState();
  const [invitationCode, setInvitationCode] = useState();
  const [timeId, setTimeId, refTimeId] = useStateAndRef(0);

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
    console.log(code)
    await axios.get(baseUrl + 'chat_proxy/get_user_wx_id?js_code=' + code).then((response) => {
      const data = response?.data?.data
      console.log(data)
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

  const invokePaymentWindow = async (amount, invitationCode) => {
    const params = {
      "user_id": userId,
      "amount": amount,
      "invitation_code": invitationCode,
    }
    await axios.post(baseUrl + 'chat_proxy/wechat_jsapi_pay', params).then((response) => {
      const responseData = response?.data?.data;
      if (responseData) {
        const { transaction_id, prepay_id } = responseData;
        // console.log(transaction_id, prepay_id);
        const checkPaymentParams = {
          transaction_id
        }
        handlePay(prepay_id, checkPaymentParams);
        // const id = setInterval(() => getPaymentStatus(checkPaymentParams), 2000)
        // setTimeout(() => clearInterval(id), 15000);
        // setTimeId(id);
      }
    }).catch(r => console.log(r));
    setModalVisible(false);
  }

  const getPaymentStatus = async (checkPaymentParams) => {
    await axios.post(baseUrl + 'chat_proxy/wechat_jsapi_query', checkPaymentParams).then((response) => {
      if (response?.data.data) {
        message.info('充值成功');
      } else {
        message.info(response)
      }
    }).catch(r => message.warn(r));
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
      } else if (response.data.data === 'no chat quota') {
        message.info(response.data?.data);
        newMessageList.splice(-1, 1, {
          sender: 0,
          message: `抱歉你的对话次数已用完，可以充值继续购买`
        });
        newMessageList.push({
          sender: 0,
          message: `${userId}///@nhRqW6BHERdToPv34Kp5LCGDpG0eRshz6Ttpz3UXM0tVbrFuzqEYUaif5k39/#@`
        })
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

  const handlePay = (prepay_id, checkPaymentParams) => {
    message.info("handlePay");
    if (typeof window.WeixinJSBridge == "undefined") {
      if (document.addEventListener) {
        document.addEventListener(
          "WeixinJSBridgeReady",
          onBridgeReady,
          false
        );
      } else if (document.attachEvent) {
        document.attachEvent("WeixinJSBridgeReady", onBridgeReady);
        document.attachEvent("onWeixinJSBridgeReady", onBridgeReady);
      }
    } else {
      onBridgeReady(prepay_id, checkPaymentParams);
    }
  }
  
  const onBridgeReady = (prepay_id, checkPaymentParams) => {
    message.info("onBridgeReady");
    const appId = "wxfc9591f30d5e5b0b";              //公众号ID，由商户传入  
    const timeStamp = parseInt(+new Date() / 1000);   //时间戳，自1970年以来的秒数  
    const nonceStr = Math.random().toString(36).slice(-10) + Math.random().toString(36).slice(-10);
    const packageString = "prepay_id=" + prepay_id;
    const sign = `${appId}\n${timeStamp}\n${nonceStr}\n${packageString}\n`
    let encryptor = new JSEncrypt();
    encryptor.setPrivateKey(PRIVATE_KEY);
    const paySign = encryptor.sign(sign, CryptoJS.SHA256, "sha256");
    window.WeixinJSBridge.invoke(
      "getBrandWCPayRequest",
      {
        "appId": appId,
        "timeStamp": timeStamp.toString(),
        "nonceStr": nonceStr,      //随机串     
        "package": packageString,
        "signType": "RSA",     //微信签名方式：     
        "paySign": paySign //微信签名 
      },
      function (res) {
        if (res.err_msg === "get_brand_wcpay_request:ok") {
          message.info("ok");
          getPaymentStatus(checkPaymentParams);
        } else {
          console.log("fail");
        }
      }
    );
  }

  return (
    <div className="chat-room">
      {/* {userId !== "" && <div className='user-id' onClick={() => {
        setModalVisible(true);
        setRechargeAmount();
        setInvitationCode();
      }}>userid: {userId}</div>} */}
      <div className='message-part'>
        {
          messageList.map(item =>
            <MessageBox sender={item.sender} message={item.message} loadingText={loadingText}></MessageBox>
          )
        }
      </div>
      <div className='typing-part'>
        <div className="">
          <Button
            className='charge-button'
            onClick={() => {
              setModalVisible(true);
              setRechargeAmount();
              setInvitationCode();
            }}
          >充值</Button>
          {/* <Button className='charge-button' disabled>历史对话</Button> */}
          {/* <div className='balance'> 还可以提问{balance}次</div> */}
        </div>
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
      <Modal
        title="充值"
        visible={modalVisible}
        onOk={() => {
          if (rechargeAmount) {
            invokePaymentWindow(rechargeAmount, invitationCode);
          } else {
            message.info('请至少选择一个金额');
          }
        }}
        onCancel={() => { setModalVisible(false); setRechargeAmount(); }}
        width="70%"
        maskClosable={false}
        closable={false}
        cancelText="取消"
        okText="确认"
      >
        <Button type={rechargeAmount === 3 ? "primary" : null} onClick={() => setRechargeAmount(3)}>3元(15条)</Button>
        <Button type={rechargeAmount === 26 ? "primary" : null} onClick={() => setRechargeAmount(26)} style={{ "marginLeft": '5px' }}>26元(150条)</Button>
        <Input value={invitationCode} onChange={(v) => setInvitationCode(v.target.value)} placeholder="请输入邀请码（如有）" style={{ "marginTop": '5px' }}></Input>
      </Modal>
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
