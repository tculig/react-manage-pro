import { Nav, Navbar as ReactstrapNavbar, NavItem, NavLink, NavbarBrand, Button } from "reactstrap";
import React from "react";
import PropTypes from "prop-types";
import { useHistory } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSyncAlt } from "@fortawesome/free-solid-svg-icons";
import ConfirmationModal from "../../modals/ConfirmationModal";
import "./style.scss";
import useModal from "../../utils/useModal";

export default function Navbar(props) {
  const { tabs } = props;
  const history = useHistory();
  const { isShowing, toggleModal } = useModal();
  function PopulateNavs() {
    const newNavItems = [];
    tabs.forEach((element) => {
      newNavItems.push(
        <NavItem id={element.name} className="rukica" key={element.name}>
          <NavLink onClick={() => history.push(element.url)}>
            {element.name}
          </NavLink>
        </NavItem>,
      );
    });
    return newNavItems;
  }
  function resetDatabase() {
    fetch("http://localhost:3001/resetDatabase")
      .then(() => {
        window.location.reload();
      });
  }

  return (
    <ReactstrapNavbar id="HSBavbar" color="light" light expand="md">
      <NavbarBrand href="/">HSVisum</NavbarBrand>
      <Nav navbar>
        <PopulateNavs />
      </Nav>
      <div style={{ position: "absolute", right: "10px" }}>
        <Button color="danger" onClick={toggleModal}>
          <FontAwesomeIcon icon={faSyncAlt} />
        </Button>
      </div>
      <ConfirmationModal
        header="Confirmation"
        message="Reset the database?"
        confirm={resetDatabase}
        isShowing={isShowing}
        close={toggleModal}
      />
    </ReactstrapNavbar>
  );
}

Navbar.propTypes = {
  tabs: PropTypes.arrayOf(PropTypes.object).isRequired,
};
