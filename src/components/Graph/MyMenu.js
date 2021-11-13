import { ContextMenu } from '@antv/graphin-components';


const { Menu } = ContextMenu;

const menuOptions = [
    {
        key: '2-degree',
        name: '探索二度节点',
    },
]
const handleMenu = (opt, data) => {
    // const { graph, apis } = useContext(GraphinContext);
    if (opt.key === '2-degree') {
        console.log(data)
    }
    // let res = graph.getNeighbors(data.id)
    // console.log(res)
}


export default function MyMenu() {
    return (
        <ContextMenu style={{ width: 156 }} bindType="node">
            <Menu options={menuOptions} onChange={handleMenu} bindType="node" />
        </ContextMenu>
    )
}