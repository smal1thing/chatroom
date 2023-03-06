
import axios from "axios";
import { useState, useEffect, useRef } from 'react';
import { Input, Button, message, Modal } from 'antd';
import { ShareModal } from './ShareModal'
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
  message: `你好！我是钛月AI助手：基于与国外ChatGPT一样的gpt3.5训练的强大人工智能引擎开发。
  我可以：写论文润色、角色扮演、知识百科、百度答题、作业解答分析、写代码等等...
  你可以尝试输入问题：
  [解释下量子计算机的原理]
  [我要举办生日会，策划一个有趣的活动 ]
  [写一篇广告策划方案]
  如需更多免费消息次数：
  “分享”框分享你的专属链接给15个朋友自动获得7天免费会员
  “分享”框分享你的专属链接给5个好友自动获得30条消息`
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
  const [userId, setUserId] = useState('oVa5_5_3o9WK2x3e_jIOe3pMz7Bc');
  const [userInvitationCode, setUserInvitationCode] = useState('');
  const [balance, setBalance] = useState();
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [rechargeAmount, setRechargeAmount] = useState();
  const [invitationCode, setInvitationCode] = useState();
  const [shareInvitationUrl, setShareInvitationUrl] = useState('');

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
        const checkPaymentParams = {
          transaction_id: transaction_id,
          invitation_code: invitationCode,
        }
        handlePay(prepay_id, checkPaymentParams);
      }
    }).catch(r => {
      console.log(r)
      message.warn("请联系公众号【钛月ai助手】");
    });
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
          
          “分享”框复制分享你的专属链接给15个朋友自动获得7天免费会员
          或
          “分享”框复制分享你的专属链接给5个好友自动获得30条消息
          或
          购买18元包月高级无限制会员`
        });
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
          getPaymentStatus(checkPaymentParams);
        } else {
          console.log("fail");
        }
      }
    );
  }

  return (
    <div className="chat-room">
      {debugString !== "" && <div className='user-id' onClick={() => {

      }}>{debugString}</div>}
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
          <Button
            className='charge-button'
            onClick={() => {
              setShareModalOpen(true);
            }}
          >分享</Button>

          {userInvitationCode !== '' && <div className='balance'>您的邀请码: {userInvitationCode}</div>}
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
        <Button type={rechargeAmount === 3 ? "primary" : null} onClick={() => setRechargeAmount(3)}>3元(30条)</Button>
        <Button type={rechargeAmount === 18 ? "primary" : null} onClick={() => setRechargeAmount(18)} style={{ "marginLeft": '5px' }}>18元(300条)</Button>
        <Input value={invitationCode} onChange={(v) => setInvitationCode(v.target.value)} placeholder="请输入邀请码（如有）" style={{ "marginTop": '5px' }}></Input>
      </Modal>
      <ShareModal open={shareModalOpen}
        onCancel={() => { setShareModalOpen(false) }}
        shareInvitationUrl={shareInvitationUrl}>
      </ShareModal>
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
