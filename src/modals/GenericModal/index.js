import React from "react";
import ReactDOM from "react-dom";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import PropTypes from "prop-types";
import "./style.scss";

export default function GenericModal(props) {
  const { header, message, confirm, cancel, isShowing, close, className } = props;

  return isShowing
    ? ReactDOM.createPortal(
      <Modal isOpen style={{ marginTop: "88px" }} className={className}>
        <ModalHeader>{header}</ModalHeader>
        <ModalBody>{message}</ModalBody>
        <ModalFooter>
          <Button
            color="primary"
            onClick={() => {
              confirm();
              close();
            }}
          >
            Confirm
          </Button>
          <Button
            color="danger"
            onClick={() => {
              cancel();
              close();
            }}
          >
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
  isShowing: PropTypes.bool.isRequired,
  className: PropTypes.string
};

GenericModal.defaultProps = {
  header: <></>,
  message: <></>,
  cancel: () => {},
  className: null
};
