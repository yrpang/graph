import { Tooltip } from '@antv/graphin-components';

export default function Tooltips() {
    return (
        <Tooltip bindType="node" placement='right' hasArrow='true' >
            <Tooltip.Node>
                {model => {
                    return (
                        <div className="menu-list">
                            节点信息
                            <li>id:{model.id}</li>
                            <li>name: {model.info.name}</li>
                            {/* <li>value: {model.info.value}</li> */}
                        </div>
                    );
                }}
            </Tooltip.Node>
        </Tooltip>
    )
}