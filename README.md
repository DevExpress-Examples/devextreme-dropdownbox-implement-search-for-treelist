<!-- default badges list -->
[![](https://img.shields.io/badge/Open_in_DevExpress_Support_Center-FF7200?style=flat-square&logo=DevExpress&logoColor=white)](https://supportcenter.devexpress.com/ticket/details/T1011746)
[![](https://img.shields.io/badge/📖_How_to_use_DevExpress_Examples-e9f6fc?style=flat-square)](https://docs.devexpress.com/GeneralInformation/403183)
<!-- default badges end -->
# DropDownBox - How to implement search for TreeList

This example illustrates how to implement search for TreeList.

The search feature is implemented in the DropDownBox component's [onInput](https://js.devexpress.com/Documentation/ApiReference/UI_Components/dxDropDownBox/Configuration/#onInput) event handler. This modifies the TreeList's searchPanel [text](https://js.devexpress.com/Documentation/ApiReference/UI_Components/dxTreeList/Configuration/searchPanel/#text) property. The TreeList's [onSelectionChanged](https://js.devexpress.com/Documentation/ApiReference/UI_Components/dxTreeList/Configuration/#onSelectionChanged) event handler updates the DropDownBox's value. The keyboard navigation using the arrow down key is implemented in the DropDownBox's [onKeyDown](https://js.devexpress.com/Documentation/ApiReference/UI_Components/dxDropDownBox/Configuration/#onKeyDown) event handler.
