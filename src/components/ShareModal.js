import React, { useRef, useEffect } from 'react';
import ClipboardJS from 'clipboard';
import { Input, Button, message, Modal } from 'antd';
import { QRCodeSVG } from 'qrcode.react';

export function ShareModal(props) {
    const { open, onCancel, shareInvitationUrl } = props;
    const textRef = useRef(null);
    let clipboard = null;
    const handleClick = () => {
        if (!clipboard) {
            clipboard = new ClipboardJS(textRef.current, {
                text: () => shareInvitationUrl,
                action: 'copy'
            });

            clipboard.on('success', () => { message.info("复制成功") });
        }

    };
    return (<Modal
        open={open}
        onCancel={onCancel}
        closable={false}
        footer={null}
    >
        <div
            style={{
                fontSize: '16px',
                marginBottom: '10px',
            }}>
            您的分享链接：
            <button ref={textRef}
                onClick={handleClick}
                style={{
                    background: 'grey',
                    borderRadius: '10px',
                    border: 'none',
                    fontSize: '14px',
                    marginTop: '5px',
                    marginBottom: '5px',
                    marginLeft: '10px',
                    paddingLeft: '10px',
                    paddingRight: '10px',

                }}>
                一键复制
            </button>
            <div style={{ fontSize: '12px' }}>{shareInvitationUrl}</div>
        </div>
        <div style={{ fontSize: '16px', marginBottom: '10px' }}>您也可以分享二维码：</div>
        <div style={{ marginLeft: '20px' }}>
            <QRCodeSVG value={shareInvitationUrl} size={100} />
        </div>
        <div style={{ border: '1px solid', marginTop: '10px', marginBottom: '10px' }} />
        <div style={{ fontSize: '14px', color: 'gray' }}>
            <div><i className="fa-solid fa-circle-check"></i><span style={{ marginLeft: '4px' }}>分享链接，赢得提问机会！</span></div>
            <div><i className="fa-solid fa-circle-check"></i><span style={{ marginLeft: '4px' }}>您只需将链接发送给朋友即可</span></div>
            <div><i className="fa-solid fa-circle-check"></i><span style={{ marginLeft: '4px' }}>详情请联系“钛月ai助手”公众号</span></div>

        </div>
    </Modal >);

}