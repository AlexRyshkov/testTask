import {OverlayTrigger, Tooltip} from "react-bootstrap";
import React from "react";

export function TooltipForComponent({component, text}) {
    return <OverlayTrigger
        key={0}
        placement="top"
        overlay={<Tooltip id={3}>{text}</Tooltip>}>
        {component}
    </OverlayTrigger>;
}