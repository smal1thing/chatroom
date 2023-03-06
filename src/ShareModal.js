import React from 'react';
import { Input, Button, message, Modal } from 'antd';
export function ShareModal(props) {
    const { open, onCancel, shareInvitationUrl } = props;
    return (<Modal
        title="分享邀请码"
        open={open}
        onCancel={onCancel}
        footer={null}
    >
        <div style={{ fontSize: '16px' }}>您的分享链接：{shareInvitationUrl}</div>
        <div style={{ fontSize: '12px', color: 'gray' }}>
            <div>·分享链接，赢得提问机会！</div>
            <div>·您只需将链接发送给朋友即可</div>
            <div>·详情请联系“钛月ai助手”公众号</div>
        </div>
    </Modal>);

}