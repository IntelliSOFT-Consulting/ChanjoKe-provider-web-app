export const updateStock = async (updates, inventory) => {
    const updatedInventory = { ...inventory }
    const updatedItems = updatedInventory.extension[0].extension.map((item) => {
        const updatedItem = { ...item }
        const update = updates.find((update) => update.id === item.id)
        if (update) {
        updatedItem.valueInteger = update.value
        }
        return updatedItem
    })
    updatedInventory.extension[0].extension = updatedItems
    return updatedInventory
}