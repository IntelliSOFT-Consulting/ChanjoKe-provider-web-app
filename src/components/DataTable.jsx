import {Table} from "antd";
import {createUseStyles} from "react-jss";
import LoadingArrows from "../common/spinners/LoadingArrows";

const useStyles = createUseStyles({
    "@global": {
        ".ant-table": {
            borderRadius: "0px !important", "& .ant-table-container": {
                borderRadius: "0px !important", "& table": {
                    borderCollapse: "collapse", borderColor: "rgba(112, 112, 112,.2) !important", "& td, th, tr": {
                        borderColor: "rgba(112, 112, 112,.2) !important", "&::before": {
                            backgroundColor: "rgba(112, 112, 112,.2) !important",
                        },
                    },
                }, "& .ant-table-thead": {
                    borderRadius: "0px !important", "& .ant-table-cell": {
                        borderRadius: "0px !important", backgroundColor: "#163C9412 !important",
                    },
                },
            },
        },
    },
});

const DataTable = (props) => {
    const classes = useStyles();
    return (<Table
            className={classes.root}
            {...props}
            loading={props.loading ? {
                indicator: (<div className="flex justify-center items-center">
                        <LoadingArrows/>
                    </div>),
            } : false}
            bordered
        />);
};

export default DataTable;
