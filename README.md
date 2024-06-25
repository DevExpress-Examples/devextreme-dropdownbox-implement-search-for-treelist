<!-- default badges list -->
[![](https://img.shields.io/badge/Open_in_DevExpress_Support_Center-FF7200?style=flat-square&logo=DevExpress&logoColor=white)](https://supportcenter.devexpress.com/ticket/details/T1011746)
[![](https://img.shields.io/badge/📖_How_to_use_DevExpress_Examples-e9f6fc?style=flat-square)](https://docs.devexpress.com/GeneralInformation/403183)
[![](https://img.shields.io/badge/💬_Leave_Feedback-feecdd?style=flat-square)](#does-this-example-address-your-development-requirementsobjectives)
<!-- default badges end -->

# DropDownBox for DevExtreme - How to implement search for TreeList

This example illustrates how to implement search for TreeList.

The search feature is implemented in the DropDownBox component's [onInput](https://js.devexpress.com/Documentation/ApiReference/UI_Components/dxDropDownBox/Configuration/#onInput) event handler. This modifies the TreeList's searchPanel [text](https://js.devexpress.com/Documentation/ApiReference/UI_Components/dxTreeList/Configuration/searchPanel/#text) property. The TreeList's [onSelectionChanged](https://js.devexpress.com/Documentation/ApiReference/UI_Components/dxTreeList/Configuration/#onSelectionChanged) event handler updates the DropDownBox's value. The keyboard navigation using the arrow down key is implemented in the DropDownBox's [onKeyDown](https://js.devexpress.com/Documentation/ApiReference/UI_Components/dxDropDownBox/Configuration/#onKeyDown) event handler.

<div align="center"><img alt="DropDownBox for DevExtreme - How to implement search for TreeList" src="dx-dropdownbox-implement-search-for-treelist.png" /></div>

## Files to Review

- **Angular**
    - [app.component.html](Angular/src/app/app.component.html)
    - [app.component.ts](Angular/src/app/app.component.ts)
- **jQuery**
    - [index.html](jQuery/src/index.html)
    - [index.js](jQuery/src/index.js)
- **ASP.NET**    
    - [Index.cshtml](ASP.NET/Views/Home/Index.cshtml)

## Documentation

- [Getting Started with DropDownBox](https://js.devexpress.com/Documentation/Guide/UI_Components/DropDownBox/Getting_Started_with_DropDownBox/)

- [DropDownBox - API Reference](https://js.devexpress.com/Documentation/ApiReference/UI_Components/dxDropDownBox/)
<!-- feedback -->
## Does this example address your development requirements/objectives?

[<img src="https://www.devexpress.com/support/examples/i/yes-button.svg"/>](https://www.devexpress.com/support/examples/survey.xml?utm_source=github&utm_campaign=devextreme-dropdownbox-implement-search-for-treelist&~~~was_helpful=yes) [<img src="https://www.devexpress.com/support/examples/i/no-button.svg"/>](https://www.devexpress.com/support/examples/survey.xml?utm_source=github&utm_campaign=devextreme-dropdownbox-implement-search-for-treelist&~~~was_helpful=no)

(you will be redirected to DevExpress.com to submit your response)
<!-- feedback end -->
