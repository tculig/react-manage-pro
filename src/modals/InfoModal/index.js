import React from "react";
import ReactDOM from "react-dom";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import PropTypes from "prop-types";
import "./style.scss";

export default function InfoModal(props) {
  const { header, message, isShowing, close } = props;

  return isShowing
    ? ReactDOM.createPortal(
      <Modal isOpen style={{ marginTop: "88px" }}>
        <ModalHeader>{header}</ModalHeader>
        <ModalBody>{message}</ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={() => close()}>
            Close
          </Button>
        </ModalFooter>
      </Modal>,
      document.getElementById("modal-root")
    )
    : null;
}

InfoModal.propTypes = {
  header: PropTypes.string,
  message: PropTypes.string.isRequired,
  close: PropTypes.func.isRequired,
  isShowing: PropTypes.bool.isRequired,
};

InfoModal.defaultProps = {
  header: "Notification",
};
