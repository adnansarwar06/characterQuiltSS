import { StudentTable } from './components/StudentTable';
import { initialStudentData } from './config/InitialStudentData';
import styled from 'styled-components';
import { useTheme } from './context/ThemeContext';

const AppContainer = styled.div`
  padding: 0;
  margin: 0;
  background-color: #f1f5f9;
  min-height: 100vh;
  width: 100vw;
  overflow-x: auto;
`;

const Header = styled.h1`
  color: #0f172a;
  margin-bottom: 20px;
  font-size: 24px;
`;

/**
 * Main application component that renders the student table
 * @returns {JSX.Element} The rendered application
 */
function App() {
  return (
    <AppContainer>
      <StudentTable initialData={initialStudentData} />
    </AppContainer>
  );
}

export default App;
