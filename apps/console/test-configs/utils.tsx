/**
 * Copyright (c) 2021-2024, WSO2 LLC. (https://www.wso2.com).
 *
 * WSO2 LLC. licenses this file to you under the Apache License,
 * Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import { AuthProvider } from "@asgardeo/auth-react";
import {  RenderResult, render as rtlRender } from "@testing-library/react";
// import { AccessControlProvider } from "@wso2is/access-control";
import { AuthenticateUtils } from "@wso2is/features/admin.authentication.v1/utils/authenticate-utils";
import { PreLoader } from "@wso2is/features/admin.core.v1/components/pre-loader/pre-loader";
import React, { PropsWithChildren, ReactElement } from "react";
import { Provider } from "react-redux";
import { mockStore } from "./__mocks__/redux/redux-store";
import ReduxStoreStateMock from "./__mocks__/redux/redux-store-state";
// import { AccessControlUtils } from "../src/features/access-control/configs/access-control";

/**
 * Custom render method to includes things like global context providers, data stores, etc.
 * @see {@link https://testing-library.com/docs/react-testing-library/setup#custom-render} for more info.
 *
 * @param ui - Component to render.
 * @param allowedScopes - Set of allowed scopes for the logged in user.
 * @param featureConfig - UI Features configuration i.e permissions etc.
 * @param initialState - Redux store initial state.
 * @param store - Mocked store.
 * @param renderOptions - Render options.
 *
 * @returns RenderResult
 */
const render = (
    ui: ReactElement,
    {
        // allowedScopes = "internal_login",
        // featureConfig = window[ "AppUtils" ].getConfig().ui.features,
        initialState = ReduxStoreStateMock,
        store = mockStore(initialState),
        ...renderOptions
    }: any = {}
): RenderResult => {

    const Wrapper = (props: PropsWithChildren): ReactElement => {

        const { children } = props;

        window.URL.createObjectURL = jest.fn();
        window.MessageChannel = jest.fn();

        return (
            <Provider store={ store }>
                { /* Temporarily commenting out the AccessControlProvider due to issues with mocking
                    window["AppUtils"] */ }
                { /* <AccessControlProvider
                            allowedScopes={ allowedScopes }
                            features={ featureConfig }
                            permissions={ AccessControlUtils.getPermissions(featureConfig, allowedScopes) }
                        >
                    </AccessControlProvider>
                    */ }
                { children }
            </Provider>
        );
    };

    return rtlRender(ui, { wrapper: Wrapper, ...renderOptions });
};

const renderWithAuthWrapper = (
    ui: ReactElement,
    {
        // allowedScopes = "internal_login",
        // featureConfig = window[ "AppUtils" ].getConfig().ui.features,
        initialState = ReduxStoreStateMock,
        store = mockStore(initialState),
        ...renderOptions
    }: any = {}
): RenderResult => {

    const Wrapper = (props: PropsWithChildren): ReactElement => {

        const { children } = props;

        window.URL.createObjectURL = jest.fn();
        window.MessageChannel = jest.fn();

        return (
            <AuthProvider
                config={ AuthenticateUtils.getInitializeConfig() }
                fallback={ <PreLoader /> }
                getAuthParams={ AuthenticateUtils.getAuthParams }
            >
                <Provider store={ store }>
                    { /* Temporarily commenting out the AccessControlProvider due to issues with mocking
                    window["AppUtils"] */ }
                    { children }
                </Provider>
            </AuthProvider>
        );
    };

    return rtlRender(ui, { wrapper: Wrapper, ...renderOptions });
};

// re-export everything
export * from "@testing-library/react";
// override render method
export { render, renderWithAuthWrapper };
