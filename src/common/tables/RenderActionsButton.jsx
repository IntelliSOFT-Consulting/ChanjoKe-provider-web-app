import { useNavigate } from "react-router-dom";
import { Popconfirm } from "antd";

export default function RenderActionButton({ actions, onBtnAction, data }) {
  const navigate = useNavigate();

  const handleActionClick = (action) => {
    if ('url' in action) {
      navigate(action.url);
    }

    if ('btnAction' in action) {
      onBtnAction && onBtnAction(action.btnAction, data);
    }
  };

  if (Array.isArray(actions)) {
    return actions.map((action, index) => {
      if (action?.title === 'cancel') {
        return (
          <Popconfirm
            title="Are you sure you want to cancel?"
            onConfirm={() => handleActionClick(action)}
            okText="Yes"
            cancelText="No"
          >
            <button key={index} className={`${action.class} px-2 py-1 text-red-400`}>
              {action.title.charAt(0).toUpperCase() + action.title.slice(1)}
            </button>
          </Popconfirm>
        )
      } else return (
        <button key={index} className={`${action.class} px-2 py-1 text-blue-400`} onClick={() => handleActionClick(action)}>
          {action.title.charAt(0).toUpperCase() + action.title.slice(1)}
        </button>
        )
      });
  }
}