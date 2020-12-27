import React from "react";
import ReactDOM from "react-dom";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import PropTypes from "prop-types";
import "./style.scss";

export default function GenericModal(props) {
  const { header, message, confirm, cancel, isShowing, close } = props;

  return isShowing
    ? ReactDOM.createPortal(
      <Modal isOpen style={{ marginTop: "88px" }}>
        <ModalHeader>{header}</ModalHeader>
        <ModalBody>{message}</ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={() => close(confirm)}>
            Confirm
          </Button>
          <Button color="danger" onClick={() => close(cancel)}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>,
      document.getElementById("modal-root")
    )
    : null;
}

GenericModal.propTypes = {
  header: PropTypes.node,
  message: PropTypes.node,
  confirm: PropTypes.func.isRequired,
  cancel: PropTypes.func,
  close: PropTypes.func.isRequired,
  isShowing: PropTypes.bool.isRequired
};

GenericModal.defaultProps = {
  header: <></>,
  message: <></>,
  cancel: () => {},
};
