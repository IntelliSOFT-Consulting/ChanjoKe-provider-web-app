import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import routes from './routes/index'
import IsMobileView from './components/isMobileView'
import { RouterProvider } from 'react-router-dom'
import reportWebVitals from './reportWebVitals'
import { ConfigProvider } from 'antd'
import { Provider } from 'react-redux'
import store from './redux/store'

const defaultData = {
  borderRadius: 6,
  colorPrimary: '#163C94',
  Button: {
    colorPrimary: '#163C94',
  },
  Input: {
    colorPrimary: '#163C94',
  },
}

const App = () => {
  const [isMobileOrTablet, setIsMobileOrTablet] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 1012px)');
    const handleWidthChange = (e) => {
      setIsMobileOrTablet(e.matches);
    };

    handleWidthChange(mediaQuery);

    mediaQuery.addListener(handleWidthChange);

    return () => {
      mediaQuery.removeListener(handleWidthChange);
    };
  }, []);

  return (
    <React.StrictMode>
      <Provider store={store}>
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
          {isMobileOrTablet &&
            <IsMobileView />}
          {!isMobileOrTablet &&
            <RouterProvider router={routes} />}
        </ConfigProvider>
      </Provider>
    </React.StrictMode>
  )
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
