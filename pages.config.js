import Home from './pages/Home';
import Chatbot from './pages/Chatbot';
import Careers from './pages/Careers';
import Scholarships from './pages/Scholarships';
import Updates from './pages/Updates';
import Contact from './pages/Contact';
import CourseDetails from './pages/CourseDetails';
import Profile from './pages/Profile';
import __Layout from './Layout.jsx';


export const PAGES = {
    "Home": Home,
    "Chatbot": Chatbot,
    "Careers": Careers,
    "Scholarships": Scholarships,
    "Updates": Updates,
    "Contact": Contact,
    "CourseDetails": CourseDetails,
    "Profile": Profile,
}

export const pagesConfig = {
    mainPage: "Home",
    Pages: PAGES,
    Layout: __Layout,
};
