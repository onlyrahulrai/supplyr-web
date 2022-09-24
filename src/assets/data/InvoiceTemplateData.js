import {ClassicImage,DefaultImage} from "../img";
import {ClassicTemplate, DefaultTemplate } from "../../components/invoice"

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
        name:"Classic",
        slug:"classic",
        picture:ClassicImage,
        component:<ClassicTemplate />
    },
]

export default data;