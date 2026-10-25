import importlib.util
import json
import os
from pathlib import Path
import subprocess
import sys
import tempfile
import unittest


def load_script(name):
    spec = importlib.util.spec_from_file_location(name, Path(__file__).parents[1] / 'scripts' / f'{name}.py')
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


class BuildToolsTest(unittest.TestCase):
    def test_firebase_disabled_without_configuration(self):
        generate = load_script('generate_firebase_config').generate_config
        self.assertEqual(generate({}), {'enabled': False})

    def test_partial_configuration_fails_without_revealing_values(self):
        generate = load_script('generate_firebase_config').generate_config
        with self.assertRaisesRegex(ValueError, 'FIREBASE_AUTH_DOMAIN'):
            generate({'FIREBASE_API_KEY': 'example'})

    def test_deployment_requires_configuration_even_when_all_values_are_missing(self):
        generate = load_script('generate_firebase_config').generate_config
        with self.assertRaisesRegex(ValueError, 'FIREBASE_API_KEY'):
            generate({}, require_config=True)

    def test_deployment_writes_config_to_artifact_without_changing_source(self):
        root = Path(__file__).parents[1]
        script = root / 'scripts/generate_firebase_config.py'
        source = root / 'assets/js/firebase-config.json'
        original = source.read_bytes()
        environ = {key: value for key, value in os.environ.items() if not key.startswith('FIREBASE_')}
        environ.update({key: 'example' for key in (
            'FIREBASE_API_KEY', 'FIREBASE_AUTH_DOMAIN', 'FIREBASE_PROJECT_ID', 'FIREBASE_APP_ID',
        )})
        with tempfile.TemporaryDirectory() as directory:
            target = Path(directory) / '_site/assets/js/firebase-config.json'
            result = subprocess.run(
                [sys.executable, str(script), '--output', str(target), '--require-config'],
                env=environ, capture_output=True, text=True,
            )
            self.assertEqual(result.returncode, 0, result.stderr)
            config = json.loads(target.read_text(encoding='utf-8'))
            self.assertEqual(config['apiKey'], 'example')
            self.assertTrue(config['enabled'])
            self.assertEqual(source.read_bytes(), original)
            # Missing Environment settings must stop deployment and retain the artifact.
            environ.pop('FIREBASE_API_KEY')
            result = subprocess.run(
                [sys.executable, str(script), '--output', str(target), '--require-config'],
                env=environ, capture_output=True, text=True,
            )
            self.assertNotEqual(result.returncode, 0)
            self.assertIn('FIREBASE_API_KEY', result.stderr)
            self.assertEqual(json.loads(target.read_text(encoding='utf-8')), config)

    def test_special_characters_remain_data(self):
        generate = load_script('generate_firebase_config').generate_config
        value = 'quote" newline\n $(not-a-command)'
        config = generate({key: value for key in ('FIREBASE_API_KEY', 'FIREBASE_AUTH_DOMAIN', 'FIREBASE_PROJECT_ID', 'FIREBASE_APP_ID')})
        self.assertEqual(config['apiKey'], value)

    def test_checker_catches_missing_images_and_fragments(self):
        check = load_script('check_site').check_site
        with tempfile.TemporaryDirectory() as directory:
            path = Path(directory) / 'index.html'
            path.write_text('<a href="#missing">Link</a><img src="/Notes/missing.png">', encoding='utf-8')
            _, errors = check(directory, '/Notes')
            self.assertEqual(len(errors), 2)
            path.write_text('<p id="ok">Text</p><a href="#ok">Link</a>', encoding='utf-8')
            self.assertEqual(check(directory, '/Notes')[1], [])


if __name__ == '__main__':
    unittest.main()
