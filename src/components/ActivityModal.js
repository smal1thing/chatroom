import React, { useState, useEffect } from 'react';
import { Input, Button, message, Modal } from 'antd';
import Cookies from 'js-cookie';
import { QRCodeSVG } from 'qrcode.react';

const ACTIVITY_KEY = 'activityShowTimes';
export function ActivityModal(props) {
    const { invitationCode } = props;
    const [open, setOpen] = useState(false);

    useEffect(() => {
        const showTimes = Number(Cookies.get(ACTIVITY_KEY));
        console.log('modal', showTimes);
        if (!showTimes || showTimes <= 2) {
            setOpen(true);
        }
    }, [])

    const onCancel = () => {
        const showTimes = Number(Cookies.get(ACTIVITY_KEY));
        Cookies.set(ACTIVITY_KEY, showTimes ? showTimes + 1 : 1);
        setOpen(false);
    }
    return (<Modal
        open={open}
        onCancel={onCancel}
        closable={false}
        footer={null}
    >

        <div style={{ fontSize: '14px' }}>
            各位用户大家好！钛月ai助手为了给广大用户提供更好的服务，特设置此问卷来了解大家的使用体验和诉求，期望收到大家的真诚反馈！
            完成本问卷可获得10条免费消息～<br />
            <br />
            您的邀请码： {invitationCode} <br />
            问卷链接：<a href="https://www.wjx.cn/vm/wOvHppL.aspx">https://www.wjx.cn/vm/wOvHppL.aspx</a>
        </div>
    </Modal >);

}