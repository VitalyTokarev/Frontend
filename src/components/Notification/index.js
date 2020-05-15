import React, { useState, useEffect, useCallback } from 'react';
import ee from 'event-emitter';

import './index.css';
import { NotificationContext } from '../../context/NotificationContext';

const emitter = new ee();

export default WrappedComponent => {
    return props => {
        const [style, setStyle] = useState({top: -100 + 'px'});
        const [msg, setMsg] = useState('');
        const [visible, setVisible] = useState(false);

        useEffect(() => {          
            const onShow = msg => {
                if (visible) { return; }
                setMsg(msg);
                setVisible(true);
            };
          
            emitter.on('notification', onShow);
            return () => emitter.off('notification', onShow);
        }, [visible]);

        useEffect(() => {
            if (visible) {
                setTimeout(() => {
                    setStyle({top: 16 + 'px'});
                }, 100)
            }
        }, [visible]);

        useEffect(() => {
            if (style.top === 16 + 'px') {
                setTimeout(() => {
                  setStyle({top: -100 + 'px'});
                }, 3000);
            }

            if (style.top === -100 + 'px') {
                setTimeout(() => {
                    setVisible(false);
                }, 500)
            }
        }, [style]);

        const notify = useCallback(
            msg => {
                emitter.emit('notification' , msg);
        },[]);

        return(
            <React.Fragment>
                {visible && 
                <div className="notification" style={style}>
                    {msg}
                </div>}
                    <NotificationContext.Provider 
                        value = { {notify} }
                    >
                        <WrappedComponent {...props}/>
                    </NotificationContext.Provider>
            </React.Fragment>               
        );
    };
}