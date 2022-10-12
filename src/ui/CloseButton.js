import { Link } from "react-router-dom"
import NAV_ICONS from "../features/images/icons/nav";

const CloseButton = () => <Link to='/locations' className='absolute right-0 m-4 cursor-pointer'>
  <img alt='close' src={NAV_ICONS.navClose}/>
</Link>;

export default CloseButton;
