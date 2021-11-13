import { Toolbar } from '@antv/graphin-components';
import {
    ZoomOutOutlined,
    ZoomInOutlined
} from '@ant-design/icons';

const handleClick = (graphinContext, config) => {
    const { apis } = graphinContext;
    const { handleZoomIn, handleZoomOut } = apis;
    if (config.key === 'zoomIn') {
        handleZoomIn();
    } else if (config.key === 'zoomOut') {
        handleZoomOut();
    }
};

const options = [
    {
        key: 'zoomOut',
        name: (
            <span>
                放大 <ZoomInOutlined />
            </span>
        ),
        icon: <ZoomInOutlined />,
    },
    {
        key: 'zoomIn',
        name: <ZoomOutOutlined />,
    },
];

export default function MyToolbar() {
    return (
        <Toolbar options={options} onChange={handleClick} />
    )
}