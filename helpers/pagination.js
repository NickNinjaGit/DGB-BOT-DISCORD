module.exports = async function pagination(pageId, ItensPerPage, itemList) {
    const startIndex = (pageId - 1) * ItensPerPage;
    const endIndex = startIndex + ItensPerPage;
    return itemList.slice(startIndex, endIndex); // Retorna um array de itens
}