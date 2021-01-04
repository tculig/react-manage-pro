import React from "react";
import ReactDOM from "react-dom";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import PropTypes from "prop-types";
import "./style.scss";

export default function GenericModal(props) {
  const { header, message, confirm, cancel, isShowing, close, className, footerText } = props;

  return isShowing
    ? ReactDOM.createPortal(
      <Modal isOpen style={{ marginTop: "88px" }} className={className}>
        <ModalHeader>{header}</ModalHeader>
        <ModalBody>{message}</ModalBody>
        <ModalFooter>
          <div style={{ display: "flex", flexDirection: "row", width: "100%" }}>
            <div style={{ flexGrow: "1", position: "relative", alignContent: "center", verticalAlign: "bottom" }}>
              <div style={{ color: "red" }}>
                {footerText}
              </div>
            </div>
            <div>
              <Button
                style={{ marginRight: "8px" }}
                color="primary"
                onClick={() => {
                  confirm();
                  if (close !== null) close();
                }}
              >
                Confirm
              </Button>
              <Button
                color="danger"
                onClick={() => {
                  cancel();
                  if (close !== null) close();
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
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
  close: PropTypes.func,
  isShowing: PropTypes.bool,
  className: PropTypes.string,
  footerText: PropTypes.string
};

GenericModal.defaultProps = {
  isShowing: true,
  header: <></>,
  message: <></>,
  cancel: () => {},
  close: null,
  className: null,
  footerText: ""
};
