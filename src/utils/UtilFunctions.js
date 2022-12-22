//Filter number-only attributes
export function filterNumberAttributes(attribute_array) {

    const accepted_types = ['xsd:int', 'xsd:long', 'xsd:double']
    const filtered_attributes = attribute_array.filter((attr) => {
        return accepted_types.indexOf(attr.attribute_type) > -1;
    })

    return filtered_attributes
}


