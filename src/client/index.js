// Your index.js file inside the client folder should import the main function of your application javascript, it should import your scss, and it should export your main function from your application javascript. But in order to import, where will you need to export it?
import { handleSubmit } from './js/application';
import './styles/styles.scss';
import svg from './media/travel-planner.svg';
import img from './media/travel-planner_1280.jpg';
import imgTablet from './media/travel-planner_1280_tablet.jpg';


export { handleSubmit };