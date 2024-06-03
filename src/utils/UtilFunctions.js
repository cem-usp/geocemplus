//Filter number-only attributes
export function filterNumberAttributes(attribute_array) {

    const accepted_types = ['xsd:int', 'xsd:long', 'xsd:double']
    const filtered_attributes = attribute_array.filter((attr) => {
        return accepted_types.includes(attr.attribute_type) && attr.attribute_label;
    })

    return filtered_attributes
}


