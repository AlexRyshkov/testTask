import React, {useEffect, useState} from "react";
import {arrayMove, getEmptyTemplate} from "../Helpers";
import {validateTemplate} from "../Validator";
import {AddTemplate, GetTemplates, UpdateTemplate} from "../Api";
import {
    Alert,
    Badge,
    Button,
    ButtonGroup,
    ButtonToolbar,
    Card,
    Col,
    Form,
    FormControl,
    InputGroup,
} from "react-bootstrap";
import {TooltipForComponent} from "./TooltipForComponent";
import {MdAdd, MdArrowDownward, MdArrowUpward, MdRemove, MdFlag} from "react-icons/md";
import {TemplateFieldsTable} from "./TemplateFieldsTable";
import {useRouteMatch} from "react-router-dom";

export function ApplicationTemplateEditor() {
    const isCreateMode = useRouteMatch("/templates/create") !== null;
    const [template, setTemplate] = useState(getEmptyTemplate());
    const [selectedFieldIndex, setSelectedFieldIndex] = useState(-1);
    const [currentErrors, setCurrentErrors] = useState([]);
    const [newStatus, setNewStatusValue] = useState("");
    const [templates, setTemplates] = useState([]);
    const [successMessage, setSuccessMessage] = useState("");
    useEffect(() => {
        if (!isCreateMode) {
            (async () => {
                let response = await GetTemplates();
                let getTemplates = await response.json();
                setTemplate(getTemplates.length > 0 && getTemplates[0]);
                setTemplates(getTemplates);
            })();
        }
    }, [isCreateMode]);

    function OnSelectedTemplateChange(e) {
        setTemplate(templates.filter(template => template.id === parseInt(e.target.value))[0]);
    }

    function onTemplateNameChange(e) {
        setTemplate({...template, name: e.target.value});
    }

    function onAddStatusClick() {
        if (newStatus.length === 0) {
            setCurrentErrors(["Название статуса не может быть пустым"])
            return;
        }
        if (template.statuses.some(status => status.name === newStatus)) {
            setCurrentErrors([`Название статуса '${newStatus}' уже используется`])
            return;
        }
        setTemplate({...template, statuses: [...template.statuses, {name: newStatus, isInitial: false}]})
        setNewStatusValue("");
    }

    function onSetStatusInitialClick(status) {
        setTemplate({...template, statuses: template.statuses.map(s => ({...s, isInitial: s === status}))})
    }

    function onDeleteStatusClick(status) {
        setTemplate({...template, statuses: template.statuses.filter(s => s.name !== status.name)})
    }

    function onNewFieldClick() {
        setTemplate({
            ...template,
            fields: [...template.fields, {name: "", type: "text", order: template.fields.length}]
        });
    }

    function onDeleteFieldClick() {
        let newFields = [...template.fields];
        newFields.splice(selectedFieldIndex < 0 ? -1 : selectedFieldIndex, 1);
        setTemplate({...template, fields: newFields});
        setSelectedFieldIndex(-1);
    }

    function onFieldChange(index, changedField) {
        let newFields = [...template.fields];
        newFields[index] = changedField;
        setTemplate({...template, fields: newFields});
    }

    function onSelectedFieldChanged(index) {
        setSelectedFieldIndex(index);
    }

    function onUpArrowClick() {
        if (selectedFieldIndex <= 0) {
            return;
        }
        let newFields = arrayMove([...template.fields], selectedFieldIndex, selectedFieldIndex - 1).map((field, index) => ({
            ...field,
            order: index
        }));
        setTemplate({...template, fields: newFields});
        setSelectedFieldIndex(selectedFieldIndex - 1);
    }

    function onDownArrowClick() {
        if (selectedFieldIndex < 0 || selectedFieldIndex >= template.fields.length - 1) {
            return;
        }
        let newFields = arrayMove([...template.fields], selectedFieldIndex, selectedFieldIndex + 1).map((field, index) => ({
            ...field,
            order: index
        }));
        setTemplate({...template, fields: newFields});
        setSelectedFieldIndex(selectedFieldIndex + 1);
    }

    async function onSaveTemplateClick() {
        let errors = validateTemplate(template);
        if (errors.length === 0) {
            let response = isCreateMode ? await AddTemplate(template) : await UpdateTemplate(template);
            if (response.status === 200) {
                let response = await GetTemplates();
                let getTemplates = await response.json();
                setTemplates(getTemplates);
                setSuccessMessage(`Шаблон успешно изменён`);
            }
            if (response.status === 201) {
                let template = await response.json();
                setSuccessMessage(`Шаблон '${template.name}' успешно создан`);
            }
            if (response.status === 500) {
                errors.push("Ошибка на стороне сервера, обратитесь в службу поддержки");
            }
            if (response.status === 400) {
                let data = await response.json();
                if (data["errors"]) {
                    for (let key in data["errors"]) {
                        if (data["errors"].hasOwnProperty(key)) {
                            errors.push(data["errors"][key]);
                        }
                    }
                }
            }
        }
        setCurrentErrors(errors);
    }

    return (<React.Fragment>
        <Card>
            <Card.Body>
                {templates.length > 0 && <Form.Group>
                    <Form.Label>Шаблон</Form.Label>
                    <Form.Control as="select" onChange={OnSelectedTemplateChange}>
                        {templates.map((template, index) => <option key={index}
                                                                    value={template.id}>{template.name}</option>)}
                    </Form.Control>
                </Form.Group>}
                <Form.Group>
                    <Form.Control type="text" placeholder="Название шаблона..." value={template.name}
                                  onChange={onTemplateNameChange}/>
                </Form.Group>
                <Form.Group>
                    <Form.Row>
                        <Col xs={12} sm={3}>
                            <InputGroup className="mb-3">
                                <FormControl value={newStatus}
                                             onChange={e => setNewStatusValue(e.target.value)}
                                             placeholder="Название статуса..."
                                />
                                <InputGroup.Append>
                                    <TooltipForComponent text="Добавить статус"
                                                         component={
                                                             <Button
                                                                 onClick={onAddStatusClick}><MdAdd/></Button>
                                                         }/>
                                </InputGroup.Append>
                            </InputGroup>
                        </Col>
                        <Col>
                            <div>
                                <h5>
                                    {template.statuses.map((status, index) =>
                                        <Badge key={index}
                                               className="status-badge"
                                               variant={status.isInitial ? "success" : "primary"}>{status.name}
                                            <TooltipForComponent
                                                text="Сделать статус начальным (статус будет автоматически присвоен при создании заявки)"
                                                component={
                                                    <MdFlag
                                                        className="remove-status"
                                                        style={{marginLeft: 5}}
                                                        onClick={e => onSetStatusInitialClick(status)}/>
                                                }/>
                                            <TooltipForComponent text="Удалить статус"
                                                                 component={
                                                                     <MdRemove
                                                                         className="remove-status"
                                                                         style={{marginLeft: 5}}
                                                                         onClick={e => onDeleteStatusClick(status)}/>
                                                                 }/>
                                        </Badge>
                                    )}
                                </h5>
                            </div>
                        </Col>
                    </Form.Row>
                </Form.Group>
                <ButtonToolbar aria-label="Templates actions">
                    <ButtonGroup aria-label="Add Remove field" className="mr-2">
                        <TooltipForComponent text="Добавить поле" component={
                            <Button onClick={onNewFieldClick}><MdAdd/></Button>
                        }/>
                        <TooltipForComponent text="Удалить выделенное или последнее поле" component={
                            <Button onClick={onDeleteFieldClick}><MdRemove/></Button>
                        }/>
                    </ButtonGroup>
                    <ButtonGroup aria-label="Move field" className="mr-2">
                        <TooltipForComponent text="Перенести выделенное поле на одну позицию вверх"
                                             component={
                                                 <Button onClick={onUpArrowClick}><MdArrowUpward/></Button>
                                             }/>
                        <TooltipForComponent text="Перенести выделенное поле на одну позицию вверх"
                                             component={
                                                 <Button
                                                     onClick={onDownArrowClick}><MdArrowDownward/></Button>
                                             }/>
                    </ButtonGroup>
                    <ButtonGroup aria-label="Save Template" className="mr-2">
                        <TooltipForComponent text="Сохранить заявку"
                                             component={
                                                 <Button onClick={onSaveTemplateClick}>
                                                     Сохранить заявку
                                                 </Button>
                                             }/>
                    </ButtonGroup>
                </ButtonToolbar>
                {currentErrors.length > 0 &&
                <div style={{marginTop: 20}}>
                    <Alert variant="danger" onClose={() => setCurrentErrors([])}
                           dismissible>
                        <Alert.Heading as="h6">Ошибка</Alert.Heading>
                        <ul>
                            {currentErrors.map((error, index) => <li key={index}>{error}</li>)}
                        </ul>
                    </Alert>
                </div>}
                {successMessage &&
                <div style={{marginTop: 20}}>
                    <Alert variant="success" onClose={() => setSuccessMessage("")}
                           dismissible>
                        <Alert.Heading as="h6">{successMessage}</Alert.Heading>
                    </Alert>
                </div>}
            </Card.Body>
        </Card>
        <div className="template-table">
            <TemplateFieldsTable template={template} selectedFieldIndex={selectedFieldIndex}
                                 onFieldChange={onFieldChange} onSelectedFieldChanged={onSelectedFieldChanged} isCreateMode={isCreateMode}/>
        </div>
    </React.Fragment>);
}