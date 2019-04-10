/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
package org.apache.syncope.client.enduser.wizards.any;

import org.apache.commons.lang3.StringUtils;
import org.apache.syncope.client.enduser.SyncopeWebApplication;
import org.apache.wicket.extensions.wizard.WizardModel;
import org.apache.wicket.extensions.wizard.WizardStep;

public class Captcha extends WizardStep implements WizardModel.ICondition {

    private static final long serialVersionUID = 702900610508752856L;

    private final CaptchaPanel<Void> captchaPanel;

    public Captcha() {
        captchaPanel = new CaptchaPanel<>("captchaPanel");
        captchaPanel.setOutputMarkupId(true);
        add(captchaPanel);
    }

    public boolean captchaCheck() {
        final String captchaText = captchaPanel.getCaptchaText();
        final String randomText = captchaPanel.getRandomText();
        return StringUtils.isBlank(captchaText) || StringUtils.isBlank(randomText)
                ? false
                : captchaText.equals(randomText);
    }

    public void reload() {
        captchaPanel.reload();
    }

    @Override
    public boolean evaluate() {
        return SyncopeWebApplication.get().isCaptchaEnabled();
    }

}