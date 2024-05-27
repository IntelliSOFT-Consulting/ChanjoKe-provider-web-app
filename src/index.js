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
import { createUseStyles } from 'react-jss'
import { debounce } from './utils/methods'

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
  const [isMobileOrTablet, setIsMobileOrTablet] = useState(false)

  const classes = useStyles()

  useEffect(() => {
    debounce(() => {
      const resizeObserver = new ResizeObserver((entries) => {
        for (const entry of entries) {
          if (entry.contentRect.width <= 1012) {
            setIsMobileOrTablet(true)
          } else {
            setIsMobileOrTablet(false)
          }
        }
      })

      resizeObserver.observe(document.body)
    }, 100)()
    const mediaQuery = window.matchMedia('(max-width: 1012px)')
    const handleWidthChange = (e) => {
      setIsMobileOrTablet(e.matches)
    }

    handleWidthChange(mediaQuery)

    mediaQuery.addListener(handleWidthChange)

    return () => {
      mediaQuery.removeListener(handleWidthChange)
    }
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
                colorPrimary: defaultData.DatePicker?.colorPrimary,
                algorithm: defaultData.DatePicker?.algorithm,
              },
              Descriptions: {
                borderRadius: 0,
              },
            },
          }}
        >
          <div className={classes.root}>
            {/* {isMobileOrTablet && <IsMobileView />} */}
            {/* {!isMobileOrTablet && <RouterProvider router={routes} />} */}
            <RouterProvider router={routes} />
          </div>
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
