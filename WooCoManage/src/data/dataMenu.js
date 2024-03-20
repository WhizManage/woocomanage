import { Container, FolderCog, LayoutDashboard, ShoppingBasket, ShoppingCart, Store, Tag, Truck } from "lucide-react";

const dataMenuTop=[
    {
        name:"Dashboard",
        link:"",
        svgIn:<LayoutDashboard size={20} strokeWidth={1.5} />,
        svgOut:<LayoutDashboard size={20} strokeWidth={1.5} />,
        visible:false
    },
    {
        name:"Products",
        link:"",
        svgIn:<ShoppingBasket size={20} strokeWidth={1.5} />,
        svgOut:<ShoppingBasket size={20} strokeWidth={1.5} />,
        visible:true
    },
    {
        name:"Coupons",
        link:"",
        svgIn:<Tag size={20} strokeWidth={1.5} />,
        svgOut:<Tag size={20} strokeWidth={1.5} />,
        visible:false
    },
    {
        name:"Orders",
        link:"",
        svgIn:<ShoppingCart size={20} strokeWidth={1.5} />,
        svgOut:<ShoppingCart size={20} strokeWidth={1.5} />,
        visible:false
    },{
        name:"Delivery management",
        link:"",
        svgIn:<Truck size={20} strokeWidth={1.5} />,
        svgOut:<Truck size={20} strokeWidth={1.5} />,
        visible:false
    },

]
const dataMenuMiddle=[
    {
        name:"Show Store",
        link:"/shop/",
        svgIn:<Store size={20} strokeWidth={1.5} />
    },
    {
        name:"WordPress control panel",
        link:"/wp-admin/",
        svgIn:<FolderCog size={20} strokeWidth={1.5} />
    },
]
export{dataMenuTop,dataMenuMiddle}