import { Input, Button, message, Modal } from 'antd';
import { useState } from 'react';
import JSEncrypt from 'jsencrypt'
import CryptoJS from "crypto-js";
import axios from "axios";
import './components.css'

const baseUrl = "https://platypus.yazuishoudalu.com/"
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

export function PayModal(props) {
    const { payModalOpen, userId, setPayModalOpen } = props;
    const [rechargeAmount, setRechargeAmount] = useState(18);
    const [invitationCode, setInvitationCode] = useState();
    // 0 高级会员 1 普通套餐
    const [option, setOption] = useState(0);

    const invokePaymentWindow = async () => {
        const params = {
            "user_id": userId,
            "amount": rechargeAmount,
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
        setPayModalOpen(false);
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

    const handlePremium = () => {
        setOption(0);
        setRechargeAmount(18);
    }

    const handleGeneral = () => {
        setOption(1);
        setRechargeAmount(3);
    }

    return (<Modal
        open={payModalOpen}
        onOk={() => {
            if (rechargeAmount) {
                invokePaymentWindow(rechargeAmount, invitationCode);
            } else {
                message.info('请至少选择一个金额');
            }
        }}
        onCancel={() => { setPayModalOpen(false); setRechargeAmount(); }}
        width="90%"
        closable={false}
        footer={null}
        bodyStyle={{
            background: '#d5f5e8',
        }}
        style={{ borderRadius: "20px" }}
    >
        {/* <Button type={rechargeAmount === 3 ? "primary" : null} onClick={() => setRechargeAmount(3)}>3元(30条)</Button>
        <Button type={rechargeAmount === 18 ? "primary" : null} onClick={() => setRechargeAmount(18)} style={{ "marginLeft": '5px' }}>18元(300条)</Button>
        <Input
            value={invitationCode}
            onChange={(v) => setInvitationCode(v.target.value)}
            placeholder="请输入邀请码（如有）"
            style={{ "marginTop": '5px' }}>
        </Input> */}
        <div style={{
            display: 'flex',
            flexDirection: 'column',
        }}>

            <div style={{
                display: 'flex',
            }}>
                <div
                    onClick={() => handlePremium()}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        width: '150px',
                        flexDirection: 'column',
                        background: option === 0 ? '#0FC7B1' : '#10A37F80',
                        fontSize: '16px',
                        padding: '10px',
                        borderRadius: '5px',
                        boxShadow: '0px 2px 4px 0px rgba(168, 169, 231, 0.4)',
                    }}>
                    高级会员<br />包月套餐
                    <div style={{
                        'display': 'flex',
                        'alignItems': 'flex-end'
                    }}>
                        <div style={{ 'textDecoration': 'line-through' }}>
                            ¥50
                        </div>
                        <div style={{
                            'fontSize': '25px',
                            'fontWeight': 'bold',
                            'color': 'red'
                        }}>
                            ¥18/月
                        </div>
                    </div>
                </div>
                <div
                    onClick={() => handleGeneral()}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        flexDirection: 'column',
                        width: '150px',
                        fontSize: '16px',
                        padding: '10px',
                        borderRadius: '5px',
                        background: option === 1 ? '#0FC7B1' : '#10A37F80',
                        marginLeft: '5px',
                        boxShadow: '0px 2px 4px 0px rgba(168, 169, 231, 0.4)',
                        // border: '2px solid'
                    }}>
                    特惠适用<br />套餐
                    <div style={{
                        fontSize: '18px',
                        fontWeight: 'bold',
                        marginTop: '5px',
                    }}>
                        ¥3/30条
                    </div>
                </div>
            </div>

            <div style={{ border: '1px solid', marginTop: '10px', marginBottom: '10px' }} />

            <div style={{
                display: option === 0 ? 'flex' : 'none',
                flexDirection: 'column'

            }}>

                <div><i className="fa-solid fa-circle-check"></i><span style={{ marginLeft: '4px' }}>支持论文润色, 一键完成作业</span></div>
                <div><i className="fa-solid fa-circle-check"></i><span style={{ marginLeft: '4px' }}>无限次数</span></div>
                <div><i className="fa-solid fa-circle-check"></i><span style={{ marginLeft: '4px' }}>专人客服支持, 专线网络优化</span></div>
                <div><i className="fa-solid fa-circle-check"></i><span style={{ marginLeft: '4px' }}>手机、电脑通用</span></div>
                <Input
                    value={invitationCode}
                    onChange={(v) => setInvitationCode(v.target.value)}
                    placeholder="输入邀请码，获得额外100次试用机会"
                    style={{ "marginTop": '10px' }}>
                </Input>
            </div>

            <div style={{
                display: option === 1 ? 'flex' : 'none',
                flexDirection: 'column'
            }}>

                <div><i className="fa-solid fa-circle-check"></i><span style={{ marginLeft: '4px' }}>特惠套餐</span></div>
                <div><i className="fa-solid fa-circle-check"></i><span style={{ marginLeft: '4px' }}>尝鲜专用</span></div>
            </div>

            <Button
                onClick={() => {
                    invokePaymentWindow();
                }}
                size='large'
                type='primary'
                style={{
                    width: '150px',
                    fontSize: '18px',
                    borderRadius: '5px',
                    background: 'white',
                    color: 'black',
                    border: 'black',
                    marginTop: '20px',
                    alignSelf: 'center',
                }}>购买</Button>
        </div>

    </Modal >)


}