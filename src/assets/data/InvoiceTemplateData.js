import {CrossBorderImage,DefaultImage} from "../img";
import {CrossBorderTemplate, DefaultTemplate } from "../../components/invoice"

const data = [
    {
        id:1,
        name:"Default",
        slug:"default",
        picture:DefaultImage,
        component:<DefaultTemplate />
    },
    {
        id:2,
        name:"Template 1: Cross Border",
        slug:"template-1",
        picture:CrossBorderImage,
        component:<CrossBorderTemplate />
    },
]

export default data;