import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPalette,
  faSearch,
  faBorderStyle,
  faTextHeight,
  faBorderAll,
  faEdit,
} from "@fortawesome/free-solid-svg-icons";
import { v4 as uuidv4 } from "uuid";

export class FlowerMenu extends React.Component {
  uuid = uuidv4();

  closeFlower() {
    document
      .getElementById("menu-open-" + this.props.gridletName + "-" + this.uuid)
      .click();
  }
  render() {
    return (
      <div style={{ position: "absolute", zIndex: "99999" }}>
        <div>
          <nav className="menu">
            <input
              type="checkbox"
              href="#"
              className="menu-open"
              name="menu-open"
              id={"menu-open-" + this.props.gridletName + "-" + this.uuid}
            />
            <label
              className="menu-open-button"
              htmlFor={"menu-open-" + this.props.gridletName + "-" + this.uuid}
              onMouseDown={(e) => {
                e.stopPropagation();
              }}
            >
              <span className="lines line-1"></span>
              <span className="lines line-2"></span>
              <span className="lines line-3"></span>
            </label>
            <a
              onClick={() => {
                this.props.toggleColorEditorFunction(this.props.gridletName);
                this.closeFlower();
              }}
              className="menu-item item-1"
            >
              <FontAwesomeIcon icon={faPalette} />{" "}
            </a>
            <a
              onClick={() => {
                this.props.resetZoom();
                this.closeFlower();
              }}
              className="menu-item item-2"
            >
              <FontAwesomeIcon icon={faSearch} />
            </a>
            <a
              onClick={() => {
                this.props.toggleEdit(this.props.gridletName);
                this.closeFlower();
              }}
              className="menu-item item-3"
            >
              <FontAwesomeIcon icon={faEdit} />{" "}
            </a>
            <a
              onClick={() => {
                this.props.toggleBorderEditorFunction(this.props.gridletName);
                this.closeFlower();
              }}
              className="menu-item item-4"
            >
              <FontAwesomeIcon icon={faBorderStyle} />{" "}
            </a>
            <a
              onClick={() => {
                this.props.toggleFontEditorFunction(this.props.gridletName);
                this.closeFlower();
              }}
              className="menu-item item-5"
            >
              <FontAwesomeIcon icon={faTextHeight} />{" "}
            </a>
            <a href="#" className="menu-item item-6">
              <FontAwesomeIcon icon={faBorderAll} />{" "}
            </a>
          </nav>
        </div>
      </div>
    );
  }
}
