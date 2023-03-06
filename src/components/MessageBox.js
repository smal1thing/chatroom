
import './components.css';
const ROBOT_AVATAR = "http://timoon-chatroom.oss-cn-hangzhou.aliyuncs.com/avatar1.png";
const USER_AVATAR = 'http://timoon-chatroom.oss-cn-hangzhou.aliyuncs.com/avatar2.png';

export function MessageBox(props) {
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
        <div><img className="avatar" src={USER_AVATAR}></img></div>
        <div className="message"><span>{message}</span></div>
      </div>
    )
  }