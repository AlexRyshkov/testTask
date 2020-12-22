export function validateTemplate(template) {
    let errors = [];
    if (template.name === "") {
        errors.push("Название типа заявки не может быть пустым")
    }
    if (template.fields.some(field => field.name === "")) {
        errors.push("Названия полей не могут быть пустыми");
    }
    if (template.statuses.length === 0) {
        errors.push("Должен быть указан хотя бы один статус");
    }
    return errors;
}