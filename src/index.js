import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import routes from './routes/index'
import {RouterProvider} from 'react-router-dom'
import reportWebVitals from './reportWebVitals';
import {ConfigProvider} from "antd";

const defaultData = {
    borderRadius: 6,
    colorPrimary: '#163C94',
    Button: {
        colorPrimary: '#163C94',
    },
    Input: {
        colorPrimary: '#163C94',
    },
};

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <ConfigProvider
            theme={{
                token: {
                    colorPrimary: defaultData.colorPrimary,
                    borderRadius: defaultData.borderRadius,
                },
                components: {
                    Button: {
                        colorPrimary: defaultData.Button?.colorPrimary,
                        algorithm: defaultData.Button?.algorithm,
                    },
                    Input: {
                        colorPrimary: defaultData.Input?.colorPrimary,
                        algorithm: defaultData.Input?.algorithm,
                    },
                    Select: {
                        colorPrimary: defaultData.Select?.colorPrimary,
                        algorithm: defaultData.Select?.algorithm,
                    },
                    InputNumber: {
                        colorPrimary: defaultData.InputNumber?.colorPrimary,
                        algorithm: defaultData.InputNumber?.algorithm,
                    },
                    DatePicker: {
                        colorPrimary: defaultData.DatePicker?.colorPrimary,
                        algorithm: defaultData.DatePicker?.algorithm,
                    },
                },
            }}
        >
            <RouterProvider router={routes}/>
        </ConfigProvider>
    </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
