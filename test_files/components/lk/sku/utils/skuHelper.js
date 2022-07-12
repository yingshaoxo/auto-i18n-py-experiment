import { UNSELECTED_SKU_VALUE_ID } from "../constants";

export const normalizeSkuTree = skuTree => {
  const normalizedTree = {};
  skuTree.forEach(treeItem => {
    normalizedTree[treeItem.k_s] = treeItem.v;
  });
  return normalizedTree;
};

// 判斷是否所有的sku都已經選中
export const isAllSelected = (skuTree, selectedSku) => {
  // 篩選selectedSku對象中key值不為空的值
  const selected = Object.keys(selectedSku).filter(
    skuKeyStr => selectedSku[skuKeyStr] !== UNSELECTED_SKU_VALUE_ID
  );
  return skuTree.length === selected.length;
};

// 根據已選擇的 sku 獲取 skuComb
export const getSkuComb = (skuList, selectedSku) => {
  const skuComb = skuList.filter(item =>
    Object.keys(selectedSku).every(
      skuKeyStr => String(item[skuKeyStr]) === String(selectedSku[skuKeyStr])
    )
  );
  return skuComb[0];
};

// 獲取已选择的sku名稱
export const getSelectedSkuValues = (skuTree, selectedSku) => {
  const normalizedTree = normalizeSkuTree(skuTree);
  return Object.keys(selectedSku).reduce((selectedValues, skuKeyStr) => {
    const skuValues = normalizedTree[skuKeyStr];
    const skuValueId = selectedSku[skuKeyStr];

    if (skuValueId !== UNSELECTED_SKU_VALUE_ID) {
      const skuValue = skuValues.filter(value => value.id === skuValueId)[0];
      skuValue && selectedValues.push(skuValue);
    }
    return selectedValues;
  }, []);
};

// 判斷sku是否可選
export const isSkuChoosable = (skuList, selectedSku, skuToChoose) => {
  const { key, valueId } = skuToChoose;

  // 先假設sku已選中，拼入已選中sku對象中
  const matchedSku = Object.assign({}, selectedSku, {
    [key]: valueId
  });

  // 再判斷剩余sku是否全部不可選，若不可選則當前sku不可選中
  const skusToCheck = Object.keys(matchedSku).filter(
    skuKey => matchedSku[skuKey] !== UNSELECTED_SKU_VALUE_ID
  );

  const filteredSku = skuList.filter(sku =>
    skusToCheck.every(
      skuKey => String(matchedSku[skuKey]) === String(sku[skuKey])
    )
  );

  const stock = filteredSku.reduce((total, sku) => {
    total += sku.stock || 0;
    return total;
  }, 0);
  return stock > 0;
};

export default {
  normalizeSkuTree,
  getSkuComb,
  getSelectedSkuValues,
  isAllSelected,
  isSkuChoosable
};
