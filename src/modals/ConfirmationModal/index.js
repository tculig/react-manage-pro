import React from "react";
import ReactDOM from "react-dom";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import PropTypes from "prop-types";
import "./style.scss";

export default function ConfirmationModal(props) {
  const { header, message, confirm, isShowing, close } = props;

  return isShowing
    ? ReactDOM.createPortal(
      <Modal isOpen style={{ marginTop: "88px" }}>
        <ModalHeader>{header}</ModalHeader>
        <ModalBody>{message}</ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={() => { confirm(); close(); }}>
            Confirm
          </Button>
          <Button color="danger" onClick={() => close()}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>,
      document.getElementById("modal-root"),
    )
    : null;
}

ConfirmationModal.propTypes = {
  header: PropTypes.string,
  message: PropTypes.string,
  confirm: PropTypes.func.isRequired,
  close: PropTypes.func.isRequired,
  isShowing: PropTypes.bool
};

ConfirmationModal.defaultProps = {
  isShowing: true,
  header: "",
  message: ""
};
