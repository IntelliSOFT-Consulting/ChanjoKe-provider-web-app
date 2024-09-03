import { ConfigProvider } from 'antd'
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom/client'
import { createUseStyles } from 'react-jss'
import { Provider } from 'react-redux'
import { RouterProvider } from 'react-router-dom'
import './index.css'
import store from './redux/store'
import reportWebVitals from './reportWebVitals'
import routes from './routes/index'
import { debounce } from './utils/methods'
dayjs.extend(customParseFormat)

const dateFormat = 'DD-MM-YYYY'

const useStyles = createUseStyles({
  '@global': {
    '.ant-card-body': {
      padding: '0px !important',
    },
    '.ant-tabs-nav-list': {
      width: '100%',
    },
    '.ant-tabs-tab': {
      backgroundColor: '#EDF1F7 !important',
      margin: '0px !important',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
    },
    '.ant-tabs-tab-active': {
      backgroundColor: '#DFEAFA !important',
    },
    '.ant-tabs-tab-btn': {
      marginLeft: '1.5rem !important',
      marginRight: '1.5rem !important',
      fontWeight: '600 !important',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    '.ant-picker-cell-selected': {
      '& div': {
        backgroundColor: '#163C94 !important',
      },
    },
    '.ant-descriptions-view': {
      borderRadius: '0px !important',
    },
    '.ant-modal-content': {
      padding: '0px !important',
      '& .ant-modal-header': {
        backgroundColor: '#163C94 !important',
        '& .ant-modal-title': {
          color: 'white !important',
          padding: '1rem !important',
        },
      },
      '& .ant-modal-close-x': {
        color: 'white !important',
      },
      '& .ant-modal-body, .ant-modal-footer': {
        padding: '10px !important',
      },
    },
  },
})

const defaultData = {
  borderRadius: 6,
  colorPrimary: '#163C94',
  algorithm: 'lighten',
  Button: {
    colorPrimary: '#163C94',
  },
  Input: {
    colorPrimary: '#163C94',
  },
  Descriptions: {
    borderRadius: '0px',
  },
}

const App = () => {
  const classes = useStyles()

  useEffect(() => {
    debounce(() => {
      const resizeObserver = new ResizeObserver((entries) => {
        for (const entry of entries) {
          const { width } = entry.contentRect
          if (width < 768) {
            document.body.classList.add('mobile')
          }
        }
      })

      resizeObserver.observe(document.body)
    }, 100)()
  }, [])

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
                colorPrimary: defaultData.colorPrimary,
                algorithm: defaultData.algorithm,
                cellActiveWithRangeBg: defaultData.colorPrimary,
  
              },
              Descriptions: {
                borderRadius: 0,
              },
              Checkbox: {
                colorPrimary: defaultData.colorPrimary,
                algorithm: defaultData.algorithm,
                colorBorder: defaultData.colorPrimary,
                colorBgContainerDisabled: '#f5f5f5',
              },
            },
          }}
          datePicker={{
            format: dateFormat,
          }}
        >
          <div className={classes.root}>
            <RouterProvider router={routes} />
          </div>
        </ConfigProvider>
      </Provider>
    </React.StrictMode>
  )
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />)

// If you want to start measuring performance in your app, pass a function
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
