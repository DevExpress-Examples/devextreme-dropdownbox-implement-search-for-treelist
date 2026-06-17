<!-- default badges list -->
![](https://img.shields.io/endpoint?url=https://codecentral.devexpress.com/api/v1/VersionRange/383087232/26.1.2%2B)
[![](https://img.shields.io/badge/Open_in_DevExpress_Support_Center-FF7200?style=flat-square&logo=DevExpress&logoColor=white)](https://supportcenter.devexpress.com/ticket/details/T1011746)
[![](https://img.shields.io/badge/📖_How_to_use_DevExpress_Examples-e9f6fc?style=flat-square)](https://docs.devexpress.com/GeneralInformation/403183)
[![](https://img.shields.io/badge/💬_Leave_Feedback-feecdd?style=flat-square)](#does-this-example-address-your-development-requirementsobjectives)
<!-- default badges end -->

# DevExtreme DropDownBox - Search in an Embedded TreeList

This example implements a search that filters data in a [TreeList](https://js.devexpress.com/Documentation/Guide/UI_Components/TreeList/Getting_Started_with_TreeList/) embedded in a [DropDownBox](https://js.devexpress.com/Documentation/Guide/UI_Components/DropDownBox/Getting_Started_with_DropDownBox/) component.

![DropDownBox filtering](./images/dx-dropdownbox-implement-search-for-treelist.png)

## Implementation Details

The example uses four [DropDownBox](https://js.devexpress.com/Documentation/ApiReference/UI_Components/dxDropDownBox/) event handlers to coordinate search behavior between the input field and the embedded TreeList.

1. The [onInput](https://js.devexpress.com/Documentation/ApiReference/UI_Components/dxDropDownBox/Configuration/#onInput) handler fires when the user types in the DropDownBox. It opens the dropdown if it is not already open, and filters the TreeList by applying a filter to the data source based on the typed text.

2. The [onOpened](https://js.devexpress.com/Documentation/ApiReference/UI_Components/dxDropDownBox/Configuration/#onOpened) handler fires when the dropdown opens. It registers a listener on the TreeList to move focus to it once the TreeList is ready for keyboard navigation.

3. The [onClosed](https://js.devexpress.com/Documentation/ApiReference/UI_Components/dxDropDownBox/Configuration/#onClosed) handler fires when the dropdown closes. It resets the search state: if the typed text does not match a valid selection, the handler either selects the first available row or clears the DropDownBox value.

4. The [onKeyDown](https://js.devexpress.com/Documentation/ApiReference/UI_Components/dxDropDownBox/Configuration/#onKeyDown) handler fires when the user presses a key. It moves focus to the TreeList when the user presses the Arrow Down key.

## Files to Review

- **Angular**
    - [app.component.html](Angular/src/app/app.component.html)
    - [app.component.ts](Angular/src/app/app.component.ts)
- **jQuery**
    - [index.html](jQuery/src/index.html)
    - [index.js](jQuery/src/index.js)
    - [helpers.js](jQuery/src/helpers.js)
- **React**
    - [DropDownList.tsx](React/src/components/DropDownList/DropDownList.tsx)
    - [service.ts](React/src/service.ts)
- **Vue**
    - [DropDownList.vue](Vue/src/components/DropDownList.vue)
    - [service.ts](Vue/src/service.ts)
- **ASP.NET Core**
    - [Index.cshtml](ASP.NET%20Core/Views/Home/Index.cshtml)

## Documentation

- [Getting Started with DropDownBox](https://js.devexpress.com/Documentation/Guide/UI_Components/DropDownBox/Getting_Started_with_DropDownBox/)
- [DropDownBox - Synchronize with the Embedded Element](https://js.devexpress.com/Documentation/Guide/UI_Components/DropDownBox/Synchronize_with_the_Embedded_Element/)
- [DropDownBox API - onInput](https://js.devexpress.com/Documentation/ApiReference/UI_Components/dxDropDownBox/Configuration/#onInput)
- [DropDownBox API - onOpened](https://js.devexpress.com/Documentation/ApiReference/UI_Components/dxDropDownBox/Configuration/#onOpened)
- [DropDownBox API - onClosed](https://js.devexpress.com/Documentation/ApiReference/UI_Components/dxDropDownBox/Configuration/#onClosed)
- [DropDownBox API - onKeyDown](https://js.devexpress.com/Documentation/ApiReference/UI_Components/dxDropDownBox/Configuration/#onKeyDown)
- [TreeList API Reference](https://js.devexpress.com/Documentation/ApiReference/UI_Components/dxTreeList/)

<!-- feedback -->
## Does This Example Address Your Development Requirements/Objectives?

[<img src="https://www.devexpress.com/support/examples/i/yes-button.svg"/>](https://www.devexpress.com/support/examples/survey.xml?utm_source=github&utm_campaign=devextreme-dropdownbox-implement-search-for-treelist&~~~was_helpful=yes) [<img src="https://www.devexpress.com/support/examples/i/no-button.svg"/>](https://www.devexpress.com/support/examples/survey.xml?utm_source=github&utm_campaign=devextreme-dropdownbox-implement-search-for-treelist&~~~was_helpful=no)

(you will be redirected to DevExpress.com to submit your response)
<!-- feedback end -->
